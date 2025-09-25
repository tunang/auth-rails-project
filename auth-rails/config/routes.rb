Rails
  .application
  .routes
  .draw do
    # use_doorkeeper
    # devise_for :users, path: '', path_names: {
    #   sign_in: 'login',
    #   sign_out: 'logout',
    #   registration: 'signup'
    # },
    # controllers: {
    #   sessions: 'users/sessions',
    #   registrations: 'users/registrations'
    # }

    # not exposing devise routes
    devise_for :users, only: []

    # our auth routes auth/signup and auth/login
    # scope 'auth' do
    #   post '/signup', to: 'auth#signup'
    #   post '/login', to: 'auth#login'
    # end
    
    namespace :api do
      namespace :v1 do
        post 'login', to: 'sessions#create'
        post 'refresh', to: 'sessions#refresh'
        post 'register', to: 'registrations#create'
        delete 'logout', to: 'sessions#destroy'
        devise_for :users,
                   path: '',
                   controllers: {
                     confirmations: 'api/v1/confirmations',
                   }

        post 'forgot', to: 'passwords#forgot'
        post 'reset', to: 'passwords#reset'
        

        scope :admin do
          resources :authors
          get 'authors/deleted/list', to: 'authors#deleted'
          post 'authors/:id/restore', to: 'authors#restore'

          resources :categories

          get 'categories/deleted/list', to: 'categories#deleted'
          post 'categories/:id/restore', to: 'categories#restore'
          
          resources :books

          get 'books/deleted/list', to: 'books#deleted'
          post 'books/:id/restore', to: 'books#restore'



          get 'orders/get_all', to: 'orders#get_all'
          patch 'orders/:id', to: 'orders#update'
          get 'orders/:id', to: 'orders#show'
        end

        scope :user do
          # /user/categories
          get '/categories/get_nested_category',
              to: 'categories#get_nested_category'

          # /user/books
          get '/categories/:id/products', to: 'books#category'
          get '/books/search', to: 'books#search'
          get '/books/:id', to: 'books#show'

          # /user/addresses route
          resources :addresses

          # /user/orders route
          resources :orders

          # /user/cart route
          get '/cart', to: 'carts#show'
          post '/cart/add', to: 'carts#add_item'
          patch '/cart/update', to: 'carts#update_item'
          delete '/cart/remove/:id', to: 'carts#remove_item'
          delete '/cart/clear', to: 'carts#clear'

          # user/me
          get '/me', to: 'users#me'
        end

        mount ActionCable.server => "/cable"
      end
    end
  end
