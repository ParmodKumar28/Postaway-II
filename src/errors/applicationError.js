export default class ApplicationError extends Error{
    constructor(message, statuscode)
    {
        super(message);
        this.statuscode = statuscode;
    }
}