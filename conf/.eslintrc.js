module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                "conf/.eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/no-this-alias": "off",
        "no-useless-escape": "off",
        "no-mixed-spaces-and-tabs": "off",
        "no-case-declarations": "off",
        "no-prototype-builtins": "off",
        "prefer-rest-params": "off",
        "prefer-rest-params": "off",
        "no-fallthrough": "off"
    }
}
