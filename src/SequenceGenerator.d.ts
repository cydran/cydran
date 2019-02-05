declare class SequenceGenerator {
    static INSTANCE: SequenceGenerator;
    private value;
    constructor();
    next(): number;
}
export default SequenceGenerator;
