# AIxLaw Repo

This is the AIxLaw repo, to run the website first follow steps in `Setup`, then follow steps in `Running the Website`.

## Project

There are three folders for each of the major components. 

* `./aixlaw` - Website frontend, everything that you view in your browser
* `./springboot`- Website backend, provide data to frontend to display and interact with ai
* `./ai` - AI backend, provide AI functionality to the website

## Running the Website

First follow the guide in `Setups` to set up node, java, and maven. Use the following instructions to locally run the website.

1. Install requirements `npm install`
2. Serve the website `npm run serve`
3. To access the website enter into your browser `http://localhost:5173`
4. Test the backend for Windows `wget http://localhost:8080/` or Mac/Linux `curl -v http://localhost:8080/`

To re-install dependencies

1. Delete conda environment with `conda env remove --name=aixlaw`
2. Delete both `./node_modules` and `./aixlaw/node_modules` folders 
3. Reinstall dependencies with `npm run install`

## Setup 

Follow these chapters step by step to set up all necessary supporting software to develop and run the website.

1. Clone the Repo
2. Install Frontend Requirements (nvm, node)
3. Install Backend Requirements (java, maven)
4. Serve

### 1. Clone the repo

1. Ensure git is installed with `git -v`, if not follow [this online guide](https://github.com/git-guides/install-git)
2. Clone the repo with `git clone https://github.com/w2ll2am/AIxLaw`
3. Enter the repo with `cd AIxLAW`

### 2. Install Frontend Requirements (nvm, node)

If you don't have node installed already we are using `nvm` to manage our versions of node. First ensure you are in the parent directory when running these steps. 

Windows Guide

1. Download nvm by downloading the `nvm-setup.exe` file [from here](https://github.com/coreybutler/nvm-windows/releases)
2. Install Node with `nvm install 20.15.0`
3. Activate Node with `nvm use 20.15.0`
4. Verify the Node version with `node -v`
5. Update `npm` with `npm install -g npm`

Mac / Linux Guide

1. Download nvm with either

    ```run curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash```

    ```wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash```

2. Install Node with `nvm install 20.15.0`
3. Activate Node with `nvm use 20.15.0`
4. Verify the Node version with `node -v`
5. Update `npm` with `npm install -g npm`

### 3. Install Backend Requirements (Java, Maven)

Windows Guide

1. Check no existing Java installation exists `java -version` 
2. Download and Install Java 22 with the [following instructions](https://www.oracle.com/java/technologies/downloads/#jdk22-windows)
3. Check correct java version is installed with `java -version`, if this is not the correct version follow the steps below. 
4. Install Maven using the [following guide](https://www.baeldung.com/install-maven-on-windows-linux-mac)
5. Verify Maven install and connection to Java 22 with `mvn -v`

Windows Guide - Steps to install correct java version.

1. restart your computer, if this still does not work try the following steps.
2. Navigate to Start --> Edit the system environment variables --> Environment Variables
3. On `User variables for {user-name}` create a `JAVA_HOME` with location of your new Javainstallation (mine points towards `C:\Program Files\Java\jdk-22`)
4. In `User variables for {user-name}` click on `Path` and click `Edit`. Delete any existingjava directories. 
5. Click `New` and the same path as `JAVA_HOME` with an extra directory `\bin` (for the sameJAVA_HOME as above my path entry looks like mine points towards `C:\ProgramFiles\Java\jdk-22\bin`)

Mac / Linux Guide

1. Ensure no existing Java installation exists with `java -version` 
2. Download and Install Java 22 with the [following instructions](https://www.oracle.com/java/technologies/downloads/#jdk22-windows)
3. Open new terminal and run `java -version`.
4. Install Maven using the [following guide](https://www.baeldung.com/install-maven-on-windows-linux-mac)
5. Verify Maven install and connection to Java 22 with `mvn -v`

### 4. Install AI Backend Requirements (python, Google Cloud CLI)

1. Install conda by following [this guide](https://conda.io/projects/conda/en/latest/user-guide/install/index.html)
2. Set up Google Cloud CLI (`gcloud`) with the following [this guide](https://cloud.google.com/sdk/docs/install)
3. Connect gcloud to project with `gcloud config set project 875513382753`
4. Enable Vertex AI API with `gcloud services enable aiplatform.googleapis.com`
5. Login with your Google account `gcloud auth application-default login`

### Summary of Software Versions and Initilisations

* git 
* Node v20.15.0
* npm 10.8.1
* React initialised with https://vitejs.dev/guide/ using 
    - React + TS
* Java 22.0.1
* Maven Latest (3.9.8)
* Springboot initialized with https://start.spring.io/ using 
    - Spring Boot 3.3.1 + Maven + Java 22
    - H2 Database
    - Lombok
    - Spring Web
* LangServe initilaised with [this template](rag-google-cloud-vertexai-search)
    - Python 3.12

## Copyright

 Copyright (C) 2024 William Booth-Clibborn w.j.boothclibborn@gmail.com
 
 This file is part of the AIxLAW project repo. It is owned by and exclusivly authored by.

 * William Booth-Clibborn
 * Jade Minwei-Wang
 * Tim Luka Horstmann
 * Taran Molloy
 * William Yu
 
 The AIxLAW project repo can not be copied, distributed, run, or used in any fashion without the express permission of all authors listed above.
