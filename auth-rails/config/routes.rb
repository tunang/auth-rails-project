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
        
        devise_for :users,
        path: '',
        controllers: {
                     confirmations: 'api/v1/confirmations',
                   }
                   
        post 'forgot', to: 'passwords#forgot'
        post 'reset', to: 'passwords#reset'
        

        scope :admin do
          resources :authors
          resources :categories
          resources :books
          post 'books/:id/restore', to: 'books#restore'

        end

        scope :user do
          resources :addresses  
        end

        
        
        
      end
    end
  end
