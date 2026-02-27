package com.harsh.Project.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Entity
@Table(name = "students")
@Builder
@Data
@AllArgsConstructor
public class Student {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
  private String name;
  private String enrollment;
    private String email;
    private String branch;
    private String program;
 public Student(){

    }
}
