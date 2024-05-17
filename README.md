# GREN Visualization

This project is the visualization for the [GREN map](https://github.com/grenmap). The outputs of this project
are embeddable files to be used on a webpage that wishes to
display the GREN map.

# Prerequisites

This project requires node.js version 10 or higher to run. You can find node.js at [this](https://nodejs.org/en/download/) link.

# Install dependencies

Before serving or building the application, run `npm install` to install all of the required node modules.

If you hit an `ERR_OSSL_EVP_UNSUPPORTED` then try running `npm install --legacy-peer-deps`. This is happening because default algorithm used by the application is not allowed in OPENSSL 3.0. [Read more details.](https://github.com/nodejs/node/blob/main/doc/changelogs/CHANGELOG_V17.md#17.0.0)

# Integrate Visualization with [gren-map-db-node](https://github.com/grenmap/GREN-Map-DB-Node)
Steps below allows to integrate the local changes made in the front-end application with the database:

Run the command `npm run bundle`. This command triggers the bundling process, which creates a `gren-map-visualization` folder containing the necessary files for deployment. There will be a `package.json` file and subfolders for the locales: `en` (English), `fr` (French) and so on.

Once the `gren-map-visualization` folder is generated, make a copy of it. Deploy instance of gren-map-db-node and replace the existing folder in gren-map-db-node `django/staticfiles/gren-map-visualization/` with the copied `gren-map-visualization` folder. This step ensures that the updated front-end files are used for integration with the database.

# Deploy Visualization map
The provided code snippet starts a local development server for the application. 

Running the command `npm run-script start` initiates this server, and you can access the application by navigating to the specified URL, `http://localhost:4200/`, in your web browser. The application automatically reloads whenever you modify any of the source files, facilitating an efficient development workflow.

# Development

- [Architecture](docs/architecture.md)
- [Code Practices](docs/code_practices.md)
- [Configuration](docs/configuration.md)
- [Release](docs/release.md)
- [Changelog](docs/changelog.md)

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run-script build` to build the project. The built project will be stored in the `dist/` directory.
The build command will automatically build for production.

## Bundle

This project is meant to be embedded on a webpage. To generate the files needed to embed this
project on a page, as well as a working example file, run `npm run-script bundle`. For more
information on how the bundling works, please refer to [bundling.md](https://github.com/grenmap/GREN-Map-Visualization/blob/main/docs/bundling.md)

## Running unit tests

Run `npm run-script test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
