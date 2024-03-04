#!/usr/bin/env node

import path from "path";
import { fileURLToPath } from 'url';
import copy from "./components/copy.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve("./");
copy(["./components/**", "./master/**", './.gitignore'], root, path.dirname(__dirname), {
    skip: copyPath => {
        const parent = path.dirname(__dirname),
            nodeModules = path.join(parent, 'components', 'node_modules')
        ;

        return copyPath.startsWith(nodeModules);
    }
})
