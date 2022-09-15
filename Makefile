
default: test-serverless

deploy:
	@serverless deploy --verbose

test-serverless:
	@docker run -t --rm \
		-v $(shell pwd):/app \
		-w /app/serverless-runner \
		-e AWS_ACCESS_KEY_ID \
		-e AWS_SECRET_ACCESS_KEY \
		node:16-alpine3.16@sha256:2c405ed42fc0fd6aacbe5730042640450e5ec030bada7617beac88f742b6997b \
		sh -c "npm ci && npm start"
