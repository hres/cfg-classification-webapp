# Cfg Classification Webapp

This project is the user interface for the CFG-Classification IP346b initiative.  It is an Angular front end that interfaces with Java Rest services.


## Prerequisites

Building this project requires the following.

	-git
	-npm
	-angular CLI 1.0.0-rc.0
	
Deploying this project requires:

	-Apache2
	-Tomcat
	
## Installing NodeJS and NPM

	*Note:  If you are installing on a Debian or Ubuntu based distrobution you will need to update your repositories.  Enter:
	curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
	
	Once you are pointing to v6.x repos enter:
	
	sudo apt-get install nodejs
		
## Install Angular CLI

	sudo npm install -g @angular/cli
	
## Git the project

	git clone https://github.com/hres/cfg-classification-webapp.git
	
Navigate to project root and run the following.

	npm install

Run `ng build -bh /cfg-classification-webapp/` to build the project. The build artifacts will be stored in the `dist/` directory.  The contents of this folder is what needs to be made available at https://lam-dev.hres.ca/cfg-classification-webapp/

## Configure the reverse proxy

	The web application sends all service calls to /cfg-task-service/.  For security reasons the actual location of the application server is hidden from the webapp and only available via the reverse proxy.  To enable the reverse proxy, on the apache box enter:
	
	sudo a2enmod proxy
	sudo a2enmod proxy_http
	
	from your favorite editor open: /etc/apache2/sites_available/000-default.conf
	Inside the VirtualHost tag add the following
	
		ProxyPreserveHost On
		ProxyPass /cfg-task-service/ http://<java-host-here:port>/cfg-task-service/
		ProxyPassReverse /cfg-task-service/ http://<java-host-here:port>/cfg-task-service/
		
	

