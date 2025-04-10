# cydran-site
The website for the Cydran framework

## Known Issues

### Webpack build failing with ERR_OSSL_EVP_UNSUPPORTED

Including the Node option to use the OpenSSL legacy provider can solve this problem.

Executing the following command line will configure this in Node:

```shell
export NODE_OPTIONS=--openssl-legacy-provider
```

See [Webpack build failing with ERR_OSSL_EVP_UNSUPPORTED [duplicate]](https://stackoverflow.com/questions/69394632/webpack-build-failing-with-err-ossl-evp-unsupported) for more details.
