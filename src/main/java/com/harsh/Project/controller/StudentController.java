package com.harsh.Project.controller;

import com.harsh.Project.Repository.StudentRepository;
import com.harsh.Project.model.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/register")
public class StudentController {
    @Autowired
    private StudentRepository repo;
  @PostMapping
    public Student registerstudent(@RequestBody Student student){
      return repo.save(student);
  }
  @GetMapping
    public List<Student> getAllStudent(){
    return repo.findAll();
  }
  @GetMapping("/{id}")
    public Student getStudentById(@PathVariable Long id){
      return repo.findById(id).orElseThrow(()->new RuntimeException("Student not found"+id));
  }
    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable Long id, @RequestBody Student studentDetails) {

        Student student = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id " + id));

        student.setName(studentDetails.getName());
        student.setEmail(studentDetails.getEmail());
        student.setEnrollment(studentDetails.getEnrollment());
        student.setBranch(studentDetails.getBranch());
        student.setProgram(studentDetails.getProgram());
        return repo.save(student);
    }
    @DeleteMapping("/{id}")
    public  void deleteStudent(@PathVariable Long id) {
        Student student = repo.findById(id).orElseThrow(() -> new RuntimeException("Student not found" + id));
        repo.delete(student);
    }
}
