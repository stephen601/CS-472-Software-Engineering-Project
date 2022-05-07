all:
	cmd /c "runWamp.bat"

updateServer:
	scp -r "/c/Dropbox/College/software engineering/CS-472-Software-Engineering-Project/code/frontend" root@172.105.155.219:/var/www/html/theater
	ssh root@172.105.155.219 'mv /var/www/html/theater/frontend/* /var/www/html/theater/'
