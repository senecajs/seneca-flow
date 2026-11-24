declare function flow(this: any, options: any): void;
declare namespace flow {
    var defaults: ({ valid }: {
        valid: any;
    }) => {
        debug: boolean;
        flows: {
            flowDef: any;
            stepDefs: any[];
        }[];
    };
}
export default flow;
