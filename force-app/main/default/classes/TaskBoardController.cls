public with sharing class TaskBoardController {
    
    @AuraEnabled(cacheable=true)
    public static List<Task> getTasks(Id recordId) {
        return [
            SELECT 
                Id, 
                Subject, 
                Owner.Name, 
                ActivityDate, 
                Description, 
                Status 
            FROM Task 
            WHERE WhatId = :recordId
        ];
    }

    @AuraEnabled
    public static List<Task> saveTasks(List<Task> tasks) {
        upsert tasks;
        return tasks;
    }

    @AuraEnabled
    public static void updateTaskStatus(Id taskId, String status) {
        update new Task(
            Id = taskId, 
            Status = status
        );
    }

}
