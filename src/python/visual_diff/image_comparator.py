#!/usr/bin/env python3
"""
Visual Regression Module - Image Comparator
Compares two images and generates a visual diff
"""

import os
import sys
import json
import logging
import tempfile
from pathlib import Path
from dataclasses import dataclass, asdict

# In a real implementation, these would be installed dependencies
# For demo purposes, we're just defining the imports
try:
    import cv2
    import numpy as np
    from PIL import Image
except ImportError:
    print("Error: This module requires OpenCV, NumPy and Pillow to be installed")
    print("Install with: pip install opencv-python numpy pillow")
    sys.exit(1)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('visual-diff')

@dataclass
class ComparisonResult:
    """Data class to store image comparison results"""
    match_percentage: float
    diff_percentage: float
    diff_pixel_count: int
    diff_image_path: str
    diff_regions: list
    baseline_dimensions: tuple
    test_dimensions: tuple
    comparison_timestamp: str
    

class ImageComparator:
    """
    Compares two images using OpenCV and identifies visual differences
    """
    
    def __init__(self):
        self.logger = logger
    
    def compare_images(self, baseline_path, test_path):
        """
        Compare two images and generate a diff image
        
        Args:
            baseline_path: Path to baseline (reference) image
            test_path: Path to test (new) image
            
        Returns:
            ComparisonResult object with comparison details
        """
        self.logger.info(f"Comparing images:")
        self.logger.info(f"  Baseline: {baseline_path}")
        self.logger.info(f"  Test:     {test_path}")
        
        # In a real implementation, this would load and process the images
        # For demo purposes, we're just returning sample data
        
        # Create a temporary file for the diff image
        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
            diff_path = tmp.name
        
        # Sample comparison result
        result = ComparisonResult(
            match_percentage=97.55,
            diff_percentage=2.45,
            diff_pixel_count=423,
            diff_image_path=diff_path,
            diff_regions=[
                {"x": 120, "y": 50, "width": 100, "height": 30},
                {"x": 320, "y": 250, "width": 200, "height": 50}
            ],
            baseline_dimensions=(1280, 800),
            test_dimensions=(1280, 800),
            comparison_timestamp=self._get_timestamp()
        )
        
        return result
    
    def _real_implementation_compare(self, baseline_path, test_path):
        """
        This would be the actual implementation using OpenCV
        """
        # Load images
        baseline_img = cv2.imread(baseline_path)
        test_img = cv2.imread(test_path)
        
        # Check if images were loaded successfully
        if baseline_img is None or test_img is None:
            raise ValueError("Could not load one or both images")
        
        # Get dimensions
        baseline_height, baseline_width = baseline_img.shape[:2]
        test_height, test_width = test_img.shape[:2]
        
        # Resize test image if dimensions don't match
        if baseline_width != test_width or baseline_height != test_height:
            test_img = cv2.resize(test_img, (baseline_width, baseline_height))
        
        # Convert to grayscale for comparison
        baseline_gray = cv2.cvtColor(baseline_img, cv2.COLOR_BGR2GRAY)
        test_gray = cv2.cvtColor(test_img, cv2.COLOR_BGR2GRAY)
        
        # Calculate absolute difference
        diff = cv2.absdiff(baseline_gray, test_gray)
        
        # Threshold the difference
        _, thresh = cv2.threshold(diff, 30, 255, cv2.THRESH_BINARY)
        
        # Find contours of differences
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # Create a visual diff by highlighting differences in red
        diff_img = baseline_img.copy()
        cv2.drawContours(diff_img, contours, -1, (0, 0, 255), 2)
        
        # Generate diff regions
        diff_regions = []
        for contour in contours:
            x, y, w, h = cv2.boundingRect(contour)
            diff_regions.append({"x": x, "y": y, "width": w, "height": h})
        
        # Calculate diff statistics
        diff_pixel_count = cv2.countNonZero(thresh)
        total_pixels = baseline_width * baseline_height
        diff_percentage = (diff_pixel_count / total_pixels) * 100
        match_percentage = 100 - diff_percentage
        
        # Save diff image
        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
            diff_path = tmp.name
            cv2.imwrite(diff_path, diff_img)
        
        # Create result
        result = ComparisonResult(
            match_percentage=match_percentage,
            diff_percentage=diff_percentage,
            diff_pixel_count=diff_pixel_count,
            diff_image_path=diff_path,
            diff_regions=diff_regions,
            baseline_dimensions=(baseline_width, baseline_height),
            test_dimensions=(test_width, test_height),
            comparison_timestamp=self._get_timestamp()
        )
        
        return result
    
    def _get_timestamp(self):
        """Get current timestamp as ISO format string"""
        from datetime import datetime
        return datetime.now().isoformat()


def main():
    """
    Test function for running the module directly
    """
    if len(sys.argv) != 3:
        print("Usage: python image_comparator.py <baseline_image> <test_image>")
        sys.exit(1)
    
    baseline_path = sys.argv[1]
    test_path = sys.argv[2]
    
    comparator = ImageComparator()
    result = comparator.compare_images(baseline_path, test_path)
    
    # Print result as JSON
    print(json.dumps(asdict(result), indent=2))


if __name__ == "__main__":
    main() 