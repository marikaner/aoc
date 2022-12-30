# frozen_string_literal: true

input = File.read("#{__dir__}/input.txt")

@commands = input.split('$ ')

@fs = {}
@cwd = []

@commands.each do |command_line|
  _, command, dir = command_line.split(' ')
  if command == 'cd'
    if dir == '..'
      @cwd.pop
    else
      @cwd << dir
      @fs[@cwd.join]
    end
  else
    _, *lines = command.split('\n')
    @fs[@cwd.join] += lines.map(&:to_i).sum
  end
end

@fs[@pwd] = 0

print @fs

def task1; end

def task2; end

puts task1
puts task2
