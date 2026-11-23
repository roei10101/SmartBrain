.PHONY: help up dev down logs seed test lint monitoring k8s-render

help:  ## Show this help
	@grep -E '^[a-zA-Z0-9_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-14s %s\n", $$1, $$2}'

up:  ## Build and start the stack
	docker compose up --build -d

dev:  ## Start the stack with backend live reload
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

down:  ## Stop the stack
	docker compose down

logs:  ## Follow the backend logs
	docker compose logs -f backend

seed:  ## Create the demo account
	docker compose exec backend python init_db.py

test:  ## Run the backend tests
	cd backend && pytest -q

lint:  ## Lint backend and frontend
	cd backend && ruff check .
	cd frontend && npm run lint

monitoring:  ## Start the stack together with Prometheus and Grafana
	docker compose --profile monitoring up --build -d

k8s-render:  ## Print the rendered Kubernetes manifests
	kubectl kustomize deploy/k8s
