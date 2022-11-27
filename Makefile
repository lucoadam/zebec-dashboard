SHELL := /bin/bash

export APP_ROOT ?= $(shell pwd)

HELM_CMD := helm
HELM_PATH := $(APP_ROOT)/helm/zebec-app

update-kubeconfig:
	@aws eks update-kubeconfig --name $(EKS_CLUSTER_NAME) --region $(AWS_REGION)

deploy-helm: update-kubeconfig
		@$(HELM_CMD) upgrade --install zebec-app $(HELM_PATH) \
		--namespace $(STAGE)-zebec-app \
		--create-namespace --wait --set \
		frontend.imageUri=$(ECR_REPO_URI):$(BUDDY_PROJECT_NAME)-$(BUDDY_EXECUTION_REVISION_SHORT)
