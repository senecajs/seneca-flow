declare function flow(this: any, options: any): void;
declare namespace flow {
    var defaults: {
        debug: boolean;
        flows: {
            flowDef: import("gubu").Node<{
                name: StringConstructor;
                kind: string;
                code: string;
                status: string;
                first: StringConstructor;
                content: {};
            }>;
            stepDefs: import("gubu").Node<{
                name: StringConstructor;
                kind: string;
                code: string;
                status: string;
                content: {};
                next: import("gubu").Node<{}>;
            }>[];
        }[];
    };
}
export default flow;
