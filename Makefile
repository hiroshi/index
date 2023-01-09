CLUSTER = gke_hiroshi-index_us-west1-a_index

all:

image-build:
	docker build -t index .

MONGODB_URI = mongodb://mongo/index
image-run:
	docker-compose up -d mongo
	docker run --rm -p3001:3000 -e MONGODB_URI=$(MONGODB_URI) --network=index_default index

gke-manifest:
	kubectl --cluster=$(CLUSTER) apply -f gke/manifest.yaml

# debug
local-build:
	docker-compose run --rm app npx next build
