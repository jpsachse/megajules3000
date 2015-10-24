from mock_generator import MockGenerator

gen = MockGenerator("mock/sample_input.json")
tilemap = gen.generate()
tilemap.as_image()
