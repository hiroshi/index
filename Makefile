CLUSTER = gke_hiroshi-index_us-west1-a_index

all:

IMAGE = us-west1-docker.pkg.dev/hiroshi-index/index/index:latest
deploy:
	gcloud run deploy index \
	  --region=us-west1 \
	  --allow-unauthenticated \
	  --service-account=index-run@hiroshi-index.iam.gserviceaccount.com \
	  --update-secrets=MONGODB_URI=mongodb-atlas-uri:latest \
	  --image=$(IMAGE) \

image-build:
	docker build --platform=linux/amd64 -t $(IMAGE) .

image-push:
	docker push $(IMAGE)

MONGODB_URI = mongodb://mongo/index
image-run:
	docker-compose up -d mongo
	docker run --rm -p3001:3000 -e MONGODB_URI=$(MONGODB_URI) --network=index_default index

gke-manifest:
	kubectl --cluster=$(CLUSTER) apply -f gke/manifest.yaml

# debug
local-build:
	docker-compose run --rm app npx next build
