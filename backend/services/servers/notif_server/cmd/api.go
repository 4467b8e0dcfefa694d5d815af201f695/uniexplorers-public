package cmd

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"

	pb "uniexplorers/proto"
)

type APIClient struct {
	httpClient *http.Client
	baseURL    string
}

func InitAPIClient(baseURL string) *APIClient {
	return &APIClient{
		httpClient: &http.Client{},
		baseURL:    baseURL,
	}
}

func (api *APIClient) ApiAddNotification(notifications []*AddNotificationsRequest) (int64, error) {
	endpoint := "/forum/notifications"
	url := api.baseURL + endpoint

	notificationsJSON, err := json.Marshal(map[string]interface{}{
		"notifications": notifications,
	})

	if err != nil {
		return 0, err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(notificationsJSON))
	if err != nil {
		return 0, err
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := api.httpClient.Do(req)
	if err != nil {
		return 0, err
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return 0, errors.New("add notif unsuccessful")
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return 0, err
	}

	var successResponse struct {
		Success      bool  `json:"success"`
		RowsAffected int64 `json:"rowsAffected"`
	}

	err = json.Unmarshal(body, &successResponse)
	if err != nil {
		return 0, err
	}

	return successResponse.RowsAffected, nil
}

func (api *APIClient) ApiGetRecentNotifications(userEmail string) ([]*pb.Notification, error) {
	endpoint := "/forum/notifications"

	params := url.Values{}
	params.Add("userEmail", userEmail)

	url := fmt.Sprintf("%s%s?%s", api.baseURL, endpoint, params.Encode())

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	resp, err := api.httpClient.Do(req)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("server FAILED: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var successResponse struct {
		Success             bool               `json:"success"`
		RecentNotifications []*pb.Notification `json:"recent_notifications"`
	}

	err = json.Unmarshal(body, &successResponse)
	if err != nil {
		return nil, err
	}

	if !successResponse.Success {
		return nil, fmt.Errorf("failure response from API")
	}

	return successResponse.RecentNotifications, nil
}

func (api *APIClient) ApiGetSubscribers(threadId int32) ([]*pb.WatchThread, error) {
	endpoint := "/forum/subscribers"

	// params := url.Values{}
	// params.Add("threadId", string(threadId))

	url := fmt.Sprintf("%s%s?threadId=%d", api.baseURL, endpoint, threadId)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	resp, err := api.httpClient.Do(req)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("server FAILED: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var successResponse struct {
		Success     bool              `json:"success"`
		Subscribers []*pb.WatchThread `json:"subscribers"`
	}

	err = json.Unmarshal(body, &successResponse)
	if err != nil {
		return nil, err
	}

	if !successResponse.Success {
		return nil, fmt.Errorf("failure response from API")
	}

	return successResponse.Subscribers, nil

}

func (api *APIClient) ApiAddSubscriber(threadId int32, userEmail string) (*pb.AddSubscriberResponse, error) {
	url := fmt.Sprintf("%s/forum/subscribers", api.baseURL)

	// reqBody, err := json.Marshal(&AddSubscriberRequest{
	// 	ThreadId:  threadId,
	// 	UserEmail: userEmail,
	// })

	// if err != nil {
	// 	return nil, err
	// }

	reqBody := []byte(fmt.Sprintf(`{"threadId": %d, "userEmail": "%s"}`, threadId, userEmail))

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(reqBody))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := api.httpClient.Do(req)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	var response pb.AddSubscriberResponse
	if resp.StatusCode == http.StatusOK {
		body, err := io.ReadAll(resp.Body)
		if err != nil {
			return nil, err
		}

		if err := json.Unmarshal(body, &response); err != nil {
			return nil, err
		}

		return &response, nil
	} else {
		if resp.StatusCode == http.StatusConflict {
			// Already subscribed
			return &response, nil
		} else {
			return nil, fmt.Errorf("server FAILED: %d", resp.StatusCode)
		}
	}
}

func (api *APIClient) ApiGetUserSubscribed(userEmail string) ([]*pb.WatchThread, error) {
	endpoint := "/forum/user_subscribed"

	params := url.Values{}
	params.Add("userEmail", userEmail)

	url := fmt.Sprintf("%s%s?%s", api.baseURL, endpoint, params.Encode())

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	resp, err := api.httpClient.Do(req)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("server FAILED: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var successResponse struct {
		Success     bool              `json:"success"`
		Subscribers []*pb.WatchThread `json:"subscribers"`
	}

	err = json.Unmarshal(body, &successResponse)
	if err != nil {
		return nil, err
	}

	if !successResponse.Success {
		return nil, fmt.Errorf("failure response from API")
	}

	return successResponse.Subscribers, nil

}
