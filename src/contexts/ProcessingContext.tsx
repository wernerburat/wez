import { createContext } from "react";

interface ProcessingContextType {

}

// -> null: default value
export const ProcessingContext = createContext<(null);


/*
1. create context
2. create provider
3. create hook
4. create consumer


React bible:
- https://reactjs.org/docs/context.html

refs are an "escape hatch" to get around the React model
- useful to work with browser APIs (e.g. DOM)

*/
