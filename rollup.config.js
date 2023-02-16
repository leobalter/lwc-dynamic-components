import lwc from '@jmsjtu/rollup-plugin';
import replace from '@rollup/plugin-replace';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const __ENV__ = process.env.NODE_ENV ?? 'development';

export default (args) => {
    return {
        input: 'src/main.js',
        preserveEntrySignatures: 'strict',

        output: {
            dir: 'dist',
            format: 'esm',
        },

        plugins: [
            replace({
                'process.env.NODE_ENV': JSON.stringify(__ENV__),
                preventAssignment: true,
            }),
            lwc({
                experimentalDynamicDirective: true,
                enableDynamicComponents: true
            }),
            args.watch &&
                serve({
                    open: false,
                    port: 3000,
                }),
            args.watch && livereload(),
        ],
    };
};
