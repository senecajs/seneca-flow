declare function flow(this: any, options: any): void;
declare namespace flow {
    var defaults: {
        debug: boolean;
        flows: {
            flowDef: {
                name: StringConstructor;
                kind: string;
                code: string;
                status: string;
                content: {};
            };
            stepDefs: {
                name: StringConstructor;
                kind: string;
                code: string;
                status: string;
                content: {};
                next: import("gubu").Node & {
                    [name: string]: any;
                };
            }[];
        }[];
    };
}
export default flow;
