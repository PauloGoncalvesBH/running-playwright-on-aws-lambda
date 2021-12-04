
default: test-serverless

deploy:
	@serverless deploy --verbose

test-serverless:
	@docker run -t --rm \
		-v $(shell pwd):/app \
		-w /app/serverless-runner \
		-e AWS_ACCESS_KEY_ID \
		-e AWS_SECRET_ACCESS_KEY \
		node:14-alpine \
		sh -c "npm ci && npm start"
