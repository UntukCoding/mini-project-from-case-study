export class Handlinerror  extends  Error{
    constructor(status,message) {
        super(message);
        this.status=status
    }
}