
deploy:
	@serverless deploy --verbose

test-serverless:
	@cd ./serverless-runner && npm start && cd ..
