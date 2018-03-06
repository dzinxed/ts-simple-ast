﻿import Project, {InterfaceDeclaration, SourceFile} from "./../../src/main";
import {Memoize, ArrayUtils} from "./../../src/utils";
import {hasDescendantBaseType} from "./../common";
import {TsNode} from "./ts";
import {WrapperFactory} from "./WrapperFactory";

export class TsInspector {
    constructor(private readonly wrapperFactory: WrapperFactory, private readonly project: Project) {
    }

    getDeclarationFile(): SourceFile {
        return this.project.getSourceFileOrThrow("node_modules/typescript/lib/typescript.d.ts");
    }

    @Memoize
    getTsNodes() {
        const compilerApiFile = this.project.getSourceFileOrThrow("typescript/typescript.ts");
        const interfaces: InterfaceDeclaration[] = [];
        for (const interfaceDec of ArrayUtils.flatten(compilerApiFile.getNamespaces().map(n => n.getInterfaces()))) {
            if (interfaceDec.getBaseTypes().some(t => hasDescendantBaseType(t, checkingType => checkingType.getText() === "ts.Node")))
                interfaces.push(interfaceDec);
        }
        return ArrayUtils.sortByProperty(interfaces.map(i => this.wrapperFactory.getTsNode(i)), item => item.getName());
    }
}
