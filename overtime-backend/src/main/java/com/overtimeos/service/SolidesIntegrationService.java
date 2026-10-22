package com.overtimeos.service;

import com.overtimeos.dto.SolidesCollaboradorDto;
import com.overtimeos.dto.SolidesWebhookPayload;
import com.overtimeos.entity.Department;
import com.overtimeos.entity.Employee;
import com.overtimeos.entity.OvertimeRequest;
import com.overtimeos.repository.DepartmentRepository;
import com.overtimeos.repository.EmployeeRepository;
import com.overtimeos.repository.OvertimeRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SolidesIntegrationService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final OvertimeRequestRepository overtimeRequestRepository;
    private final PasswordEncoder passwordEncoder;
    private final RestTemplate restTemplate;

    @Value("${solides.api.url}")
    private String apiUrl;

    @Value("${solides.api.token}")
    private String apiToken;

    /**
     * Chamado pelo webhook quando um novo colaborador é cadastrado no Solides.
     * - Se já existe (mesmo nome/matrícula): ignora
     * - Se não existe: cadastra
     */
    public boolean registerFromWebhook(SolidesWebhookPayload payload) {
        SolidesWebhookPayload.Dados dados = payload.getDados();
        if (dados == null || dados.getNome() == null) return false;

        Employee existing = findEmployee(dados.getMatricula(), dados.getNome());
        if (existing != null) {
            log.info("Solides webhook novo_colaborador: '{}' já existe, ignorando.", dados.getNome());
            return false;
        }

        return registerNewEmployee(dados);
    }

    /**
     * Chamado pelo webhook quando um colaborador é demitido no Solides.
     * Marca o colaborador como inativo (active = false).
     */
    public boolean deactivateFromWebhook(SolidesWebhookPayload payload) {
        SolidesWebhookPayload.Dados dados = payload.getDados();
        if (dados == null || dados.getNome() == null) return false;

        Employee employee = findEmployee(dados.getMatricula(), dados.getNome());
        if (employee == null) {
            log.warn("Solides webhook demissao_colaborador: '{}' não encontrado.", dados.getNome());
            return false;
        }

        if (!employee.isActive()) {
            log.info("Solides webhook demissao_colaborador: '{}' já está inativo.", employee.getName());
            return false;
        }

        employee.setActive(false);
        employeeRepository.save(employee);
        log.info("Solides webhook: colaborador '{}' marcado como inativo (demitido).", employee.getName());
        return true;
    }

    /**
     * Chamado pelo webhook quando um colaborador é editado no Solides.
     * - Se já existe: atualiza endereço e departamento
     * - Se não existe: cadastra o colaborador (e o departamento se necessário)
     */
    public boolean syncFromWebhook(SolidesWebhookPayload payload) {
        SolidesWebhookPayload.Dados dados = payload.getDados();
        if (dados == null || dados.getNome() == null) return false;

        Employee employee = findEmployee(dados.getMatricula(), dados.getNome());

        if (employee == null) {
            return registerNewEmployee(dados);
        } else {
            return updateEmployee(employee, dados);
        }
    }

    // ── Cadastro novo ─────────────────────────────────────────────────────────

    private boolean registerNewEmployee(SolidesWebhookPayload.Dados dados) {
        String deptName = dados.getDepartamento() != null ? dados.getDepartamento().getNome() : null;
        if (deptName == null || deptName.isBlank()) {
            log.warn("Solides webhook: colaborador '{}' sem departamento, ignorando cadastro.", dados.getNome());
            return false;
        }

        Department department = findOrCreateDepartment(deptName.toUpperCase().trim());
        String registration   = generateNextRegistration();
        String address        = dados.getEndereco() != null ? dados.getEndereco().buildAddress() : null;

        Employee employee = new Employee();
        employee.setName(dados.getNome().toUpperCase().trim());
        employee.setDepartment(department);
        employee.setRegistration(registration);
        employee.setSolidesRegistration(normalizeMatricula(dados.getMatricula()));
        employee.setAddress(address);

        employeeRepository.save(employee);
        log.info("Solides webhook: colaborador '{}' cadastrado — matrícula {} / depto '{}'",
                employee.getName(), registration, department.getName());
        return true;
    }

    // ── Atualização de endereço e departamento ────────────────────────────────

    private boolean updateEmployee(Employee employee, SolidesWebhookPayload.Dados dados) {
        boolean changed = false;

        // Preenche/corrige a matrícula real do Solides usada no matching do webhook
        String solidesReg = normalizeMatricula(dados.getMatricula());
        if (solidesReg != null && !solidesReg.equals(employee.getSolidesRegistration())) {
            log.info("Solides webhook: matrícula Solides de '{}': '{}' -> '{}'",
                    employee.getName(), employee.getSolidesRegistration(), solidesReg);
            employee.setSolidesRegistration(solidesReg);
            changed = true;
        }

        // Reativa colaborador caso estivesse inativo no sistema
        if (!employee.isActive()) {
            employee.setActive(true);
            changed = true;
            log.info("Solides webhook: reativando colaborador '{}' (estava inativo).", employee.getName());
        }

        // Atualiza endereço
        if (dados.getEndereco() != null) {
            String newAddress = dados.getEndereco().buildAddress();
            if (newAddress != null && !Objects.equals(employee.getAddress(), newAddress)) {
                log.info("Solides webhook: endereço de '{}': '{}' -> '{}'",
                        employee.getName(), employee.getAddress(), newAddress);
                employee.setAddress(newAddress);
                changed = true;
            }
        }

        // Atualiza departamento
        if (dados.getDepartamento() != null) {
            String newDeptName = dados.getDepartamento().getNome();
            if (newDeptName != null && !newDeptName.isBlank()) {
                String normalized = newDeptName.toUpperCase().trim();
                String currentDept = employee.getDepartment().getName().toUpperCase().trim();
                if (!currentDept.equals(normalized)) {
                    Department newDept = findOrCreateDepartment(normalized);
                    log.info("Solides webhook: departamento de '{}': '{}' -> '{}'",
                            employee.getName(), employee.getDepartment().getName(), newDept.getName());
                    employee.setDepartment(newDept);
                    changed = true;
                }
            }
        }

        if (changed) employeeRepository.save(employee);
        else log.info("Solides webhook: nenhuma alteração para '{}'.", employee.getName());
        return changed;
    }

    // ── Departamento ─────────────────────────────────────────────────────────

    private Department findOrCreateDepartment(String name) {
        return departmentRepository.findByNameIgnoreCase(name).orElseGet(() -> {
            log.info("Solides webhook: departamento '{}' não encontrado, criando...", name);
            Department dept = new Department();
            dept.setName(name);
            dept.setPassword(passwordEncoder.encode("1234"));
            dept.setAdmin(false);
            return departmentRepository.save(dept);
        });
    }

    // ── Matrícula automática ──────────────────────────────────────────────────

    private String generateNextRegistration() {
        List<Employee> all = employeeRepository.findAll();
        int max = all.stream()
                .map(Employee::getRegistration)
                .filter(r -> r != null && r.matches("\\d+"))
                .mapToInt(Integer::parseInt)
                .max()
                .orElse(0);
        return String.format("%03d", max + 1);
    }

    // ── Busca colaborador ─────────────────────────────────────────────────────

    private Employee findEmployee(String matricula, String nome) {
        List<Employee> all = employeeRepository.findAll();

        String normalizedMatricula = normalizeMatricula(matricula);
        if (normalizedMatricula != null) {
            Employee byReg = all.stream()
                    .filter(e -> normalizedMatricula.equals(e.getSolidesRegistration()))
                    .findFirst().orElse(null);
            if (byReg != null) return byReg;
        }

        String key = nome.toUpperCase().trim();
        return all.stream()
                .filter(e -> e.getName().toUpperCase().trim().equals(key))
                .findFirst().orElse(null);
    }

    private String normalizeMatricula(String matricula) {
        return (matricula == null || matricula.isBlank()) ? null : matricula.trim();
    }

    // ── Sync completo via API ─────────────────────────────────────────────────

    public int syncAll() {
        log.info("Solides: iniciando sincronização completa...");
        List<SolidesCollaboradorDto> collaborators = fetchAllCollaborators();
        if (collaborators == null || collaborators.isEmpty()) {
            log.warn("Solides: nenhum colaborador retornado.");
            return 0;
        }

        Map<String, SolidesCollaboradorDto> byName = collaborators.stream()
                .filter(c -> c.getName() != null)
                .collect(Collectors.toMap(
                        c -> c.getName().toUpperCase().trim(),
                        Function.identity(),
                        (a, b) -> a
                ));

        List<Employee> employees = employeeRepository.findAll();
        int updated = 0;

        for (Employee emp : employees) {
            SolidesCollaboradorDto solides = byName.get(emp.getName().toUpperCase().trim());
            if (solides == null) continue;

            boolean changed = false;

            String newAddress = solides.buildAddress();
            if (newAddress != null && !Objects.equals(emp.getAddress(), newAddress)) {
                log.info("Solides sync: endereço de '{}' -> '{}'", emp.getName(), newAddress);
                emp.setAddress(newAddress);
                changed = true;
            }

            String solidesReg = normalizeMatricula(solides.getRegistration());
            if (solidesReg != null && !solidesReg.equals(emp.getSolidesRegistration())) {
                log.info("Solides sync: matrícula Solides de '{}': '{}' -> '{}'",
                        emp.getName(), emp.getSolidesRegistration(), solidesReg);
                emp.setSolidesRegistration(solidesReg);
                changed = true;
            }

            String newDeptName = solides.getDepartamento() != null ? solides.getDepartamento().getNome() : null;
            if (newDeptName != null && !newDeptName.isBlank()) {
                String normalizedDept = newDeptName.toUpperCase().trim();
                String currentDept = emp.getDepartment().getName().toUpperCase().trim();
                if (!currentDept.equals(normalizedDept)) {
                    Department newDept = findOrCreateDepartment(normalizedDept);
                    log.info("Solides sync: departamento de '{}': '{}' -> '{}'",
                            emp.getName(), emp.getDepartment().getName(), newDept.getName());
                    emp.setDepartment(newDept);
                    changed = true;
                }
            }

            if (changed) {
                employeeRepository.save(emp);
                updated++;
            }
        }

        log.info("Solides: sincronização completa. {} endereço(s) atualizado(s).", updated);
        return updated;
    }

    // ── Sync de departamentos ─────────────────────────────────────────────────

    public Map<String, Object> syncDepartments() {
        log.info("Solides: sincronizando departamentos...");
        List<SolidesCollaboradorDto> collaborators = fetchAllCollaborators();

        if (collaborators == null || collaborators.isEmpty()) {
            log.warn("Solides: nenhum colaborador retornado, abortando sync de departamentos.");
            return Map.of("removed", 0, "skipped", 0, "message", "Nenhum colaborador retornado pelo Solides");
        }

        // Nomes de departamentos presentes no Solides (normalizados)
        Set<String> solidesNames = collaborators.stream()
                .filter(c -> c.getDepartamento() != null && c.getDepartamento().getNome() != null)
                .map(c -> c.getDepartamento().getNome().toUpperCase().trim())
                .collect(Collectors.toSet());

        log.info("Solides: {} departamento(s) encontrado(s) no Solides.", solidesNames.size());

        List<Department> allLocal = departmentRepository.findAll();
        int removed = 0;

        for (Department dept : allLocal) {
            if (dept.isAdmin()) continue; // nunca remove o admin
            String localName = dept.getName().toUpperCase().trim();
            if (solidesNames.contains(localName)) continue; // está no Solides, mantém

            // Deleta solicitações e funcionários do departamento antes de deletar o depto
            List<Employee> employees = employeeRepository.findAll().stream()
                    .filter(e -> e.getDepartment().getId().equals(dept.getId()))
                    .toList();

            for (Employee emp : employees) {
                List<OvertimeRequest> reqs = overtimeRequestRepository.findByEmployeeId(emp.getId());
                overtimeRequestRepository.deleteAll(reqs);
                employeeRepository.delete(emp);
                log.info("Solides: removido funcionário '{}' do departamento '{}'.", emp.getName(), dept.getName());
            }

            log.info("Solides: removendo departamento '{}' (ausente no Solides).", dept.getName());
            departmentRepository.delete(dept);
            removed++;
        }

        log.info("Solides: sync de departamentos concluído. {} departamento(s) removido(s).", removed);
        return Map.of("removed", removed,
                "message", String.format("%d departamento(s) removido(s) do sistema", removed));
    }

    private List<SolidesCollaboradorDto> fetchAllCollaborators() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Token token=" + apiToken);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        ResponseEntity<List<SolidesCollaboradorDto>> response = restTemplate.exchange(
                apiUrl + "/colaboradores",
                HttpMethod.GET,
                new HttpEntity<>(headers),
                new ParameterizedTypeReference<>() {}
        );
        return response.getBody();
    }
}
