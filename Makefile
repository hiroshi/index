CLUSTER = gke_hiroshi-index_us-west1-a_index

all:

build:
	docker-compose run --rm app npx next build

gke-manifest:
	kubectl --cluster=$(CLUSTER) apply -f gke/manifest.yaml
