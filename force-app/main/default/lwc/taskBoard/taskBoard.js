import { LightningElement, api, wire } from 'lwc';
import getTasks from '@salesforce/apex/TaskBoardController.getTasks';
import updateTaskStatus from '@salesforce/apex/TaskBoardController.updateTaskStatus';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class TaskBoard extends LightningElement {
    //Allows the component to be aware of the ID of the record (i.e. the Account)
    //that it is embedded on
    @api recordId;

    @wire(getTasks, { recordId: '$recordId' })
    tasks;

    get notStartedTasks() {
        return Array.isArray(this.tasks.data) ? this.tasks.data.filter(task => task.Status === "Not Started") : [];
    }
    get inProgressTasks() {
        return Array.isArray(this.tasks.data) ? this.tasks.data.filter(task => task.Status === "In Progress") : [];
    }
    get completedTasks() {
        return Array.isArray(this.tasks.data) ? this.tasks.data.filter(task => task.Status === "Completed") : [];
    }
    get waitingOnSomeoneTasks() {
        return Array.isArray(this.tasks.data) ? this.tasks.data.filter(task => task.Status === "Waiting on someone else") : [];
    }
    get deferredTasks() {
        return Array.isArray(this.tasks.data) ? this.tasks.data.filter(task => task.Status === "Deferred") : [];
    }

    startTaskCardDrag(event) {
        event.dataTransfer.setData("text/plain", event.target.dataset.taskId);
        console.log(
            'startTaskCardDrag', 
            'Task ID', event.target.dataset.taskId, 
            'id', event.target.id
        );
    }

    dragTaskCardOver(event) {
        event.preventDefault();
    }

    dropTaskCard(event) {
        console.log(
            'dropTaskCard', 
            event, 
            'id', 
        );

        updateTaskStatus({
            taskId: event.dataTransfer.getData("text/plain"), 
            status: event.currentTarget.dataset.taskStatus
        })
            .then(() => {
                // Requery tasks
                refreshApex(this.tasks)
                    .then(() => {
                        this.dispatchEvent(new ShowToastEvent({
                            title: "Success",
                            message: "Task Status changed",
                            variant: "success"
                        }));
                    })
                    .catch(error => {
                        this.dispatchEvent(new ShowToastEvent({
                            title: "Error",
                            message: error,
                            variant: "error"
                        }));
                    });
            })
            .catch(error => {
                this.dispatchEvent(new ShowToastEvent({
                    title: "Error",
                    message: error,
                    variant: "error"
                }));
            });

        event.preventDefault();
    }
}