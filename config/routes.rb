Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  get '/', to: 'dashboard#authentication'

  get '/profile', to: 'dashboard#profile'

  get '/login', to: 'auth#login'
  get '/register', to: 'auth#register'
  post '/register', to: 'auth#register_create', as: :register_create

  post '/login', to: 'auth#authorized', as: :authorized
  get '/logout', to: 'auth#logout'

  resource :dashboard do
  	collection do
      get '/', to: 'dashboard#index'
      get 'notification', to: 'dashboard#notification', as: :notification
    end
  end

  resource :registrations do
  	collection do
      get '/', to: 'registrations#index'
      get '/regis/:id', to: 'registrations#add', as: :add
      post '/regis/:id', to: 'registrations#create', as: :create

      post '/search/:method', to: 'registrations#search'
    end
  end

  resource :admissions do
  	collection do
      get '/', to: 'admissions#index'
    end
  end
  resource :hospitals do
  	collection do
      get '/', to: 'hospitals#index'
      get '/new', to: 'hospitals#new', as: :new
      post '/new', to: 'hospitals#create', as: :create
      get '/:id/edit', to: 'hospitals#edit', as: :edit
      get '/:id/delete', to: 'hospitals#delete', as: :delete
      post '/:id/edit', to: 'hospitals#update', as: :update

      # search
      post '/search/:method', to: 'hospitals#search'
    end
  end
  resource :clients do
  	collection do
      get '/', to: 'clients#index'
    end
  end
  resource :doctors do
  	collection do
      get '/', to: 'doctors#index'

      get '/new', to: 'doctors#new', as: :new
      post '/new', to: 'doctors#create', as: :create
      get '/:id/edit', to: 'doctors#edit', as: :edit
      get '/:id/delete', to: 'doctors#delete', as: :delete
      post '/:id/edit', to: 'doctors#update', as: :update

      # search
      post '/search/:method', to: 'doctors#search'
    end
  end
  resource :polis do
  	collection do
      get '/', to: 'polis#index'

      get '/new', to: 'polis#new', as: :new
      post '/new', to: 'polis#create', as: :create
      get '/:id/edit', to: 'polis#edit', as: :edit
      get '/:id/delete', to: 'polis#delete', as: :delete
      post '/:id/edit', to: 'polis#update', as: :update

      # search
      post '/search/:method', to: 'polis#search'
    end
  end
  resource :rooms do
  	collection do
      get '/', to: 'rooms#index'

      get '/new', to: 'rooms#new', as: :new
      post '/new', to: 'rooms#create', as: :create
      get '/:id/edit', to: 'rooms#edit', as: :edit
      get '/:id/delete', to: 'rooms#delete', as: :delete
      post '/:id/edit', to: 'rooms#update', as: :update

      # search
      post '/search/:method', to: 'rooms#search'
    end
  end
  resource :assign_doctors do
  	collection do
      get '/', to: 'assign_doctors#index'

      get '/new', to: 'assign_doctors#new', as: :new
      post '/new', to: 'assign_doctors#create', as: :create
      get '/:id/edit', to: 'assign_doctors#edit', as: :edit
      get '/:id/delete', to: 'assign_doctors#delete', as: :delete
      post '/:id/edit', to: 'assign_doctors#update', as: :update

      # search
      get '/get_polies', to: 'assign_doctors#get_polies', as: :get_polies
      post '/search/:method', to: 'assign_doctors#search'
    end
  end
  resource :schedules do
  	collection do
      get '/', to: 'schedules#index'

      get '/new', to: 'schedules#new', as: :new
      post '/new', to: 'schedules#create', as: :create
      get '/:id/edit', to: 'schedules#edit', as: :edit
      get '/:id/delete', to: 'schedules#delete', as: :delete
      post '/:id/edit', to: 'schedules#update', as: :update

      # search
      get '/get_attribute', to: 'schedules#get_attribute', as: :get_attribute
      post '/search/:method', to: 'schedules#search'
    end
  end
end
