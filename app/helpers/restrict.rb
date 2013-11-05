class Hash

  def allow(*args)
    self.select { |k, v| args.include? k.to_sym }
  end

end
