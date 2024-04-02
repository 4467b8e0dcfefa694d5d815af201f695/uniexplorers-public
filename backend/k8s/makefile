build-db:
	kubectl apply -f server-env-configmap.yaml && \
	kubectl apply -f uni-db && \
	kubectl apply -f forum-db && \
	kubectl apply -f user-db && \
	kubectl apply -f mongodb && \
	kubectl apply -f cache && \
	kubectl apply -f broker

seed-db:
	kubectl apply -f migration/seed-migration-pod.yaml && \
	kubectl apply -f migration/ingestion-pod.yaml && \
	kubectl apply -f migration/mongoseed-pod.yaml && \
	kubectl apply -f scraper

build-all:
	kubectl apply -f server-env-configmap.yaml && \
	kubectl apply -f auth-server && \
	kubectl apply -f broker && \
	kubectl apply -f cache && \
	kubectl apply -f chat-server && \
	kubectl apply -f forum-db && \
	kubectl apply -f forum-server && \
	kubectl apply -f image-server && \
	kubectl apply -f kong && \
	kubectl apply -f location-server && \
	kubectl apply -f mongodb && \
	kubectl apply -f notif-server && \
	kubectl apply -f recommender && \
	kubectl apply -f similarity-server && \
	kubectl apply -f telegram && \
	kubectl apply -f uni-db && \
	kubectl apply -f uni-server && \
	kubectl apply -f user-db && \
	kubectl apply -f user-server && \
	kubectl apply -f prometheus && \
	kubectl apply -f grafana && \
	kubectl apply -f frontend
