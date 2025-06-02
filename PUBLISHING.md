# Publishing Guide for @elselab-io/react-laravel-datatable

## Prerequisites

1. **npm account**: Make sure you have an npm account and are logged in
   ```bash
   npm login
   ```

2. **Organization access**: Ensure you have publishing rights to the `@elselab-io` organization on npm

## Publishing Steps

### 1. Version Management

Before publishing, update the version in `package.json`:

```bash
# For patch releases (bug fixes)
npm version patch

# For minor releases (new features)
npm version minor

# For major releases (breaking changes)
npm version major
```

### 2. Pre-publish Checks

The package is configured with automatic pre-publish checks:
- `prepublishOnly`: Runs build, type-check, and lint
- `prepack`: Runs build

### 3. Publish to npm

```bash
# Publish the package
npm publish

# For beta/alpha releases
npm publish --tag beta
npm publish --tag alpha
```

### 4. Verify Publication

After publishing, verify the package:
- Check on npmjs.com: https://www.npmjs.com/package/@elselab-io/react-laravel-datatable
- Test installation: `npm install @elselab-io/react-laravel-datatable`

## Package Contents

The published package includes:
- `dist/` - Compiled JavaScript and TypeScript definitions
- `README.md` - Documentation
- `LICENSE` - MIT license
- `package.json` - Package metadata

## Files Excluded from Package

The `.npmignore` file excludes:
- Source files (`src/`)
- Examples (`examples/`)
- Development configuration files
- Node modules
- Git files

## Current Package Status

✅ **Ready for Publishing**

- Package name: `@elselab-io/react-laravel-datatable`
- Version: `1.0.0`
- GitHub repository: https://github.com/elselab-io/react-laravel-datatable
- Build status: ✅ Successful
- Type definitions: ✅ Generated
- Documentation: ✅ Complete

## Post-Publishing Tasks

1. **Create GitHub Release**: Tag the version on GitHub
2. **Update Documentation**: Ensure README is up to date
3. **Announce**: Share the release with the community
4. **Monitor**: Watch for issues and feedback

## Troubleshooting

### Common Issues

1. **403 Forbidden**: Check organization permissions
2. **Version already exists**: Increment version number
3. **Build failures**: Run `npm run build` locally first

### Support

For issues with publishing:
- Check npm documentation: https://docs.npmjs.com/
- GitHub Issues: https://github.com/elselab-io/react-laravel-datatable/issues
