
default: test-serverless

deploy:
	@serverless deploy --verbose

test-serverless:
	@docker run -t --rm \
		-v $(shell pwd):/app \
		-w /app/serverless-runner \
		-e AWS_ACCESS_KEY_ID \
		-e AWS_SECRET_ACCESS_KEY \
		node:14-alpine@sha256:240e1e6ef6dfba3bb70d6e88cca6cbb0b5a6f3a2b4496ed7edc5474e8ed594bd \
		sh -c "npm ci && npm start"
