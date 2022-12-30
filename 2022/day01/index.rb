# frozen_string_literal: true

@input = File.read("#{__dir__}/input.txt")

@calories_per_elf = @input.split("\n\n").collect { |chunk| chunk.split("\n").collect { |line| Integer(line) }.sum }

def task1
  @calories_per_elf.max
end

def task2
  @calories_per_elf.max(3).sum
end

puts task1
puts task2
