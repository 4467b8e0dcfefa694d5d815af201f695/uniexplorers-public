# `k8s` deployment

## Minimum Requirements

- 30GB of free disk space
- 3GB of RAM
- 2 CPUs (more is better)
- Internet connection
- Docker

## Steps
1. Ensure you have minikube installed. Instructions can be found here: [minikube installation](https://minikube.sigs.k8s.io/docs/start/)

2. Start minikube. This command ensures that the necessary drivers are installed to run a local Kubernetes instance. 

```sh
minikube start
```

3. Trigger building all containers using the `makefile`. Necessary for first run.

```sh
make build-all
```

4. Wait for pods to run without errors. Depending on the condition of your machine, this could take up to 10 minutes.

5. For database seeding, please run the commands in the following sequence
    1. Wait until all databases are up before running `kubectl apply -f migration/seed-migration-pod.yaml`
    2. Wait until seed-migration completes before running `kubectl apply -f migration/ingestion-pod.yaml`
    3. `kubectl apply -f migration/mongoseed-pod.yaml`
    4. `kubectl apply -f scraper`

6. Proceed to verify the status of deployment. You should expect that the the seed containers have terminated with the status `Succeeded`, and the other containers are either `Pending` or `Running`. Wait for all containers to run before proceeding, or complex microservices may not be entirely functional.
```sh
kubectl get pod
```

1. After all containers have completed running or are live, in **another terminal window**, run the following command to enable connection to the services
```sh
minikube tunnel
```

2. Services should be exposed at their respective ports. Go to `localhost:<PORT>` to test

### Service Port Mappings

| Service Name        | API Base URL                    |
| ------------------- | ------------------------------- |
| `auth-server`       | `http://auth-server:8089`       |
| `chat-server`       | `http://chat-server:8080`       |
| `forum-server`      | `http://forum-server:8080`      |
| `frontend`          | `http://frontend`               |
| `grafana`           | `http://grafana:3000`           |
| `image-server`      | `http://image-server:8083`      |
| `location-server`   | `http://location-server:8080`   |
| `notif-server`      | `http://notif-server:8080`      |
| `recommender`       | `http://recommender:8080`       |
| `similarity-server` | `http://similarity-server:8080` |
| `telegram-app`      | `http://telegram-app:12069`     |
| `uni-server`        | `http://uni-server:8080`        |
| `user-server`       | `http://user-server:8080`       |

### Minikube Commands

```sh
minikube start

<!-- TEARDOWN -->
minikube delete
```

#### Command Reference
[`minikube start`](https://minikube.sigs.k8s.io/docs/commands/start/)

[`minikube tunnel`](https://minikube.sigs.k8s.io/docs/commands/tunnel/)

[`minikube delete`](https://minikube.sigs.k8s.io/docs/commands/delete/)

### K8 Commands

```sh
<!-- under each folder (e.g. kong) -->
kubectl apply -f .

kubectl get svc
kubectl get pod
```

#### Command Reference
[`kubectl get`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get)

[`kubectl apply`](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply)