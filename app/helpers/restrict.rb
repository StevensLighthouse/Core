class Hash

  def allow(*args)
    self.select { |k, v| args.include? k }
  end

end
