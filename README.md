# AIxLaw Repo

 Copyright (C) 2024 William Booth-Clibborn w.j.boothclibborn@gmail.com
 
 This file is part of the AIxLAW project repo. It is owned by and exclusivly authored by.

 * William Booth-Clibborn
 * Jade Minwei-Wang
 * Tim Luka Horstmann
 * Taran Molloy
 * William Yu
 
 The AIxLAW project repo can not be copied, distributed, or used in any fashion without the express
 permission of all authors listed above.


There are three folders for each of the major components. 

* aixlaw    - Website frontend, everything that you view in your browser
* springboot   - Website backend, provide data to frontend to display and interact with ai
* ai        - AI backend, provide AI functionality to the website

## Running website

To run frontend

1. Navigate to frontend with `cd aixlaw`
2. Install npm dependencesi with `npm install`
3. Locally host frontend with `npm run dev`

To run backend

1. Navigate to backend with `cd springboot`
2. run `mvn spring-bootL:run -e`

## Setup 

Follow these step by step to set up all necessary supporting software to develop and run the website.

1. Clone the Repo
2. Install Frontend Requirements
3. Install Backend Requirements
4. Serve

### 1. Clone the repo

1. Ensure git is installed with `git -v`, if not follow [this online guide](https://github.com/git-guides/install-git)
2. Clone the repo with `git clone https://github.com/w2ll2am/AIxLaw`
3. Enter the repo with `cd AIxLAW`


### 2. Install Frontend Requirements (nvm, node)

If you don't have node installed already we are using `nvm` to manage our versions of node. First ensure you are in the parent directory when running these steps. 

For Windows use the nvm for windows to manage node.
1. Download nvm by downloading the `nvm-setup.exe` file [from here](https://github.com/coreybutler/nvm-windows/releases)
2. Install Node with `nvm install 20.15.0`
3. Activate Node with `nvm use 20.15.0`
4. Verify the Node version with `node -v`
5. Update `npm` with `npm install -g npm`

For Mac / Linux
1. Download nvm with either
`run curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash`
`wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash`
2. Install Node with `nvm install 20.15.0`
3. Activate Node with `nvm use 20.15.0`
4. Verify the Node version with `node -v`
5. Update `npm` with `npm install -g npm`

### 3. Install Backend Requirements (Java, Maven)

For Windows

1. Ensure no existing Java installation exists with `java -version` 
2. Download and Install Java 22 with the [following instructions](https://www.oracle.com/java/technologies/downloads/#jdk22-windows)
3. Open new terminal and run `java -version`, if this does not work restart your computer, if this still does not work try the following steps.
    1. Navigate to Start --> Edit the system environment variables --> Environment Variables
    2. On `User variables for {user-name}` create a `JAVA_HOME` with location of your new Java installation (mine points towards `C:\Program Files\Java\jdk-22`)
    3. In `User variables for {user-name}` click on `Path` and click `Edit`. Delete any existing java directories. 
    4. Click `New` and the same path as `JAVA_HOME` with an extra directory `\bin` (for the same JAVA_HOME as above my path entry looks like mine points towards `C:\Program Files\Java\jdk-22\bin`)
4. Install Maven using the [following guide](https://www.baeldung.com/install-maven-on-windows-linux-mac)
5. Verify Maven install and connection to Java 22 with `mvn -v`

For mac

1. Ensure no existing Java installation exists with `java -version` 
2. Download and Install Java 22 with the [following instructions](https://www.oracle.com/java/technologies/downloads/#jdk22-windows)
3. Open new terminal and run `java -version`.
4. Install Maven using the [following guide](https://www.baeldung.com/install-maven-on-windows-linux-mac)
5. Verify Maven install and connection to Java 22 with `mvn -v`

### Summary software versions and initilisation settings
* git 
* Node v20.15.0
* npm 10.8.1
* React initialised with https://vitejs.dev/guide/ using 
- React + TS
* Java 22.0.1
* Maven Latest (3.9.8)
* Springboot initialized with https://start.spring.io/ using 
- Spring Boot 3.3.1 + Maven + Java 22
- Vertex AI Gemini
- H2 Database
- Lombok
- Spring Web
