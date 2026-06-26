package com.ldawspt.dto;

import com.ldawspt.entity.Module;

public class ModuleDto {

    private Long id;
    private Long courseId;
    private String title;
    private String description;
    private int orderIndex;

    public ModuleDto() {
    }

    public ModuleDto(Module module) {
        this.id = module.getId();
        this.courseId = module.getCourse().getId();
        this.title = module.getTitle();
        this.description = module.getDescription();
        this.orderIndex = module.getOrderIndex();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }
}
