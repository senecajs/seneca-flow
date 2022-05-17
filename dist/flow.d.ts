declare function flow(this: any, options: any): void;
declare namespace flow {
    var defaults: {
        debug: boolean;
        flows: {
            flowDef: import("gubu").Node & {
                [name: string]: any;
            };
            stepDefs: (import("gubu").Node & {
                [name: string]: any;
            })[];
        }[];
    };
}
export default flow;
