declare module '@json-editor/json-editor' {
  interface JSONEditorOptions {
    schema?: any;
    theme?: string;
    startval?: any;
    readOnly?: boolean;
    [key: string]: any; // Allow additional properties
  }

  interface ValidationError {
    path: string;
    property: string;
    message: string;
  }

  export default class JSONEditor {
    constructor(element: HTMLElement, options?: JSONEditorOptions);
    getValue(): any;
    setValue(value: any): void;
    destroy(): void;
    on(event: string, callback: () => void): void;
    validate(): ValidationError[];
  }
}
