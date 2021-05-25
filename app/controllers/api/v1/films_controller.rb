class Api::V1::FilmsController < Api::V1::BaseController
  def search
    urladdon = params[:urlAddon]
    moviepageindex = params[:moviePageIndex]
    url = "https://api.themoviedb.org/3/discover/movie?api_key=#{ENV['REACT_APP_TMDB_API_KEY']}&language=en-US&sort_by=popularity.desc&with_watch_monetization_types=flatrate&include_adult=false&include_video=false&page=#{moviepageindex}#{urladdon}";

    uri = URI(url)
    res = Net::HTTP.get_response(uri)

    if res.is_a?(Net::HTTPSuccess)
      render json: res.body
    else
      render json: res.body, status: :bad_request
    end
  end

  def runtime
    movieid = params[:movieId]
    url = "https://api.themoviedb.org/3/movie/#{movieid}?api_key=#{ENV['REACT_APP_TMDB_API_KEY']}&language=en-US"

    uri = URI(url)
    res = Net::HTTP.get_response(uri)

    if res.is_a?(Net::HTTPSuccess)
      render json: res.body
    else
      render json: res.body, status: :bad_request
    end
  end

  def trailer
    movieid = params[:movieId]
    url = "https://api.themoviedb.org/3/movie/#{movieid}/videos?api_key=#{ENV['REACT_APP_TMDB_API_KEY']}&language=en-US"

    uri = URI(url)
    res = Net::HTTP.get_response(uri)

    if res.is_a?(Net::HTTPSuccess)
      render json: res.body
    else
      render json: res.body, status: :bad_request
    end
  end

  def popular
    url = "https://api.themoviedb.org/3/trending/all/day?api_key=#{ENV['REACT_APP_TMDB_API_KEY']}&language=en-US"

    uri = URI(url)
    res = Net::HTTP.get_response(uri)

    if res.is_a?(Net::HTTPSuccess)
      render json: res.body
    else
      render json: res.body, status: :bad_request
    end
  end


end