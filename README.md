# KeyPath #

[KeyPath](https://github.com/alexjircan/KeyPath) is a modern, secure, and open-source password manager that stores and manages your most sensitive information.

## Features List ##

* Store sensitive information in entries
* Search for entries
* Password generator
* Password strenght meter

# Getting setup #

Clone the repo:
```
git clone https://github.com/alexjircan/KeyPath.git
```
Install pipenv:
```
pip install pipenv
```
Install npm dependencies for the server:
```
pipenv install
```
Install npm dependencies for the UI: <em>**TODO**</em>
```
pipenv run install_ui
```
# Watching For Changes #
This will start the Angular development server on port `4200` and a standalone server on port `8000`. It will also watch and compile changes made to the server side *Python* code and client side *Typescript*:
```
pipenv run watch
```
You should now be able to navigate to https://localhost:4200 in your browser which will connect to your keypath instance running on port 8000. The UI will automatically reload whenever you make changes to the code.

Alternatively, you can run the server side or client side separately by running:
```
pipenv run watch_server

pipenv run watch_ui
```