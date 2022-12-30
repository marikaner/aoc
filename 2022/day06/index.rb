# frozen_string_literal: true

input = File.read("#{__dir__}/input.txt")

@data = input.chars

def find_marker(size)
  @data.find_index.with_index { |_, i| @data[i, size].uniq.size == size } + size
end

def task1
  find_marker(4)
end

def task2
  find_marker(14)
end

puts task1
puts task2
