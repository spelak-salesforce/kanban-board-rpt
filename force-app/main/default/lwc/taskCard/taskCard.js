import { LightningElement, api, track } from 'lwc';
import saveTasks from '@salesforce/apex/TaskBoardController.saveTasks';

export default class TaskCard extends LightningElement {
    // NOTE: @api properties are immutable
    @api task

    @track isEditing = false;
    @track error

    description

    changeDescription(event) {
        this.description = event.target.value;
    }

    edit() {
        console.log('enable editing here!');
        
        // Prepare for editing
        {
            // Reset description to task's Description for init or if there was a canceled edit
            this.description = this.task.Description;
        }

        // Start editing
        {
            this.isEditing = true;
        }
    }

    //Basic wiring to a save method in Salesforce server
    save() {
        console.log('Clicked save');

        let taskToSave = Object.assign({}, this.task);
        {
            taskToSave.Description = this.description;

            console.log(
                'description', this.description, 
                'taskToSave.Description', taskToSave.Description,     
                'taskToSave', taskToSave
            );
        }
        saveTasks({tasks: [taskToSave]})
            .then(result => {
                console.log('Success!', result);

                // Set task as result
                {
                    /*
                        Since task is decorated with @api, task's properties are immutable.
                        Therefore, to change a task property, task needs to be reset.

                        result's ActivityDate is returned as a DateTime instead of yyyy-MM-dd
                    */
                    this.task = result[0];
                }
                
                // Stop editing
                {
                    this.isEditing = false;
                }
            })
            .catch(error => {
                console.log('Something went wrong...', error);
            })
            
        console.log('tried to save tasks');
    }

    cancel() {
        // Stop editing
        {
            this.isEditing = false;
        }
    }
}