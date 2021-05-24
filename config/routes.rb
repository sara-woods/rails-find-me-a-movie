Rails.application.routes.draw do
  root to: 'pages#home'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  post "api/v1/search", to: "api/v1/films#search"
  post "api/v1/trailer", to: "api/v1/films#trailer"
  post "api/v1/runtime", to: "api/v1/films#runtime"
  get "api/v1/popular", to: "api/v1/films#popular"
end
